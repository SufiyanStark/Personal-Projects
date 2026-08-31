$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$sourceDir = Join-Path $PSScriptRoot "..\public\models\clothing"
$outDir = Join-Path $sourceDir "processed"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$code = @"
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;

public static class ClothingCutoutProcessor
{
    private struct PointI
    {
        public int X;
        public int Y;
        public PointI(int x, int y) { X = x; Y = y; }
    }

    public static string CopyAlpha(string inputPath, string outputPath)
    {
        using (var source = new Bitmap(inputPath))
        using (var output = new Bitmap(source.Width, source.Height, PixelFormat.Format32bppArgb))
        using (var g = Graphics.FromImage(output))
        {
            g.DrawImage(source, 0, 0, source.Width, source.Height);
            output.Save(outputPath, ImageFormat.Png);
            return String.Format("{0}: copied existing alpha ({1}x{2})", Path.GetFileName(inputPath), source.Width, source.Height);
        }
    }

    public static string Cutout(string inputPath, string outputPath, int threshold, int minComponentArea, bool darkBackground)
    {
        using (var source = new Bitmap(inputPath))
        using (var output = new Bitmap(source.Width, source.Height, PixelFormat.Format32bppArgb))
        {
            int width = source.Width;
            int height = source.Height;
            var pixels = new Color[width * height];
            var background = new bool[width * height];
            var visited = new bool[width * height];
            var queue = new Queue<PointI>(width + height);
            Color border = AverageBorder(source);

            Action<int,int> enqueue = (x, y) => {
                int index = y * width + x;
                if (visited[index]) return;
                visited[index] = true;
                queue.Enqueue(new PointI(x, y));
            };

            for (int y = 0; y < height; y++)
            {
                for (int x = 0; x < width; x++)
                {
                    pixels[y * width + x] = source.GetPixel(x, y);
                }
            }

            for (int x = 0; x < width; x++) { enqueue(x, 0); enqueue(x, height - 1); }
            for (int y = 0; y < height; y++) { enqueue(0, y); enqueue(width - 1, y); }

            while (queue.Count > 0)
            {
                PointI point = queue.Dequeue();
                int index = point.Y * width + point.X;
                Color color = pixels[index];
                if (!IsBackgroundLike(color, border, threshold, darkBackground)) continue;

                background[index] = true;

                if (point.X > 0) enqueue(point.X - 1, point.Y);
                if (point.X < width - 1) enqueue(point.X + 1, point.Y);
                if (point.Y > 0) enqueue(point.X, point.Y - 1);
                if (point.Y < height - 1) enqueue(point.X, point.Y + 1);
            }

            bool[] foreground = new bool[width * height];
            for (int i = 0; i < foreground.Length; i++) foreground[i] = !background[i];

            RemoveSmallComponents(foreground, width, height, minComponentArea);
            FeatherEdges(output, pixels, foreground, width, height);
            output.Save(outputPath, ImageFormat.Png);

            int alphaCount = 0;
            for (int i = 0; i < foreground.Length; i++) if (!foreground[i]) alphaCount++;
            return String.Format("{0}: threshold={1}, dark={2}, transparentPixels={3}/{4}", Path.GetFileName(inputPath), threshold, darkBackground, alphaCount, width * height);
        }
    }

    private static Color AverageBorder(Bitmap source)
    {
        long r = 0, g = 0, b = 0, count = 0;
        int width = source.Width;
        int height = source.Height;
        int stepX = Math.Max(1, width / 220);
        int stepY = Math.Max(1, height / 140);

        for (int x = 0; x < width; x += stepX)
        {
            Add(source.GetPixel(x, 0), ref r, ref g, ref b, ref count);
            Add(source.GetPixel(x, height - 1), ref r, ref g, ref b, ref count);
        }
        for (int y = 0; y < height; y += stepY)
        {
            Add(source.GetPixel(0, y), ref r, ref g, ref b, ref count);
            Add(source.GetPixel(width - 1, y), ref r, ref g, ref b, ref count);
        }

        return Color.FromArgb((int)(r / count), (int)(g / count), (int)(b / count));
    }

    private static void Add(Color color, ref long r, ref long g, ref long b, ref long count)
    {
        r += color.R; g += color.G; b += color.B; count++;
    }

    private static bool IsBackgroundLike(Color color, Color border, int threshold, bool darkBackground)
    {
        int dr = color.R - border.R;
        int dg = color.G - border.G;
        int db = color.B - border.B;
        double distance = Math.Sqrt(dr * dr + dg * dg + db * db);
        int luminance = (int)(0.2126 * color.R + 0.7152 * color.G + 0.0722 * color.B);

        if (darkBackground)
        {
            return distance <= threshold && luminance < 46;
        }

        int max = Math.Max(color.R, Math.Max(color.G, color.B));
        int min = Math.Min(color.R, Math.Min(color.G, color.B));
        bool lowChromaLightSurface = luminance > 132 && (max - min) < 44;
        return distance <= threshold || lowChromaLightSurface;
    }

    private static void RemoveSmallComponents(bool[] foreground, int width, int height, int minArea)
    {
        bool[] visited = new bool[foreground.Length];
        var queue = new Queue<PointI>();
        var component = new List<int>();

        for (int y = 0; y < height; y++)
        {
            for (int x = 0; x < width; x++)
            {
                int start = y * width + x;
                if (!foreground[start] || visited[start]) continue;

                visited[start] = true;
                queue.Enqueue(new PointI(x, y));
                component.Clear();

                while (queue.Count > 0)
                {
                    PointI point = queue.Dequeue();
                    int index = point.Y * width + point.X;
                    component.Add(index);
                    TryVisit(point.X - 1, point.Y, width, height, foreground, visited, queue);
                    TryVisit(point.X + 1, point.Y, width, height, foreground, visited, queue);
                    TryVisit(point.X, point.Y - 1, width, height, foreground, visited, queue);
                    TryVisit(point.X, point.Y + 1, width, height, foreground, visited, queue);
                }

                if (component.Count < minArea)
                {
                    foreach (int index in component) foreground[index] = false;
                }
            }
        }
    }

    private static void TryVisit(int x, int y, int width, int height, bool[] foreground, bool[] visited, Queue<PointI> queue)
    {
        if (x < 0 || y < 0 || x >= width || y >= height) return;
        int index = y * width + x;
        if (!foreground[index] || visited[index]) return;
        visited[index] = true;
        queue.Enqueue(new PointI(x, y));
    }

    private static void FeatherEdges(Bitmap output, Color[] pixels, bool[] foreground, int width, int height)
    {
        for (int y = 0; y < height; y++)
        {
            for (int x = 0; x < width; x++)
            {
                int index = y * width + x;
                Color color = pixels[index];
                if (!foreground[index])
                {
                    output.SetPixel(x, y, Color.FromArgb(0, color.R, color.G, color.B));
                    continue;
                }

                int neighbors = 0;
                int foregroundNeighbors = 0;
                for (int oy = -1; oy <= 1; oy++)
                {
                    for (int ox = -1; ox <= 1; ox++)
                    {
                        if (ox == 0 && oy == 0) continue;
                        int nx = x + ox;
                        int ny = y + oy;
                        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
                        neighbors++;
                        if (foreground[ny * width + nx]) foregroundNeighbors++;
                    }
                }

                int alpha = foregroundNeighbors == neighbors ? 255 : 210;
                output.SetPixel(x, y, Color.FromArgb(alpha, color.R, color.G, color.B));
            }
        }
    }
}
"@

Add-Type -TypeDefinition $code -ReferencedAssemblies System.Drawing

$jobs = @(
  @{ In = "Hoodie.png"; Out = "hoodie-main.png"; Copy = $true },
  @{ In = "hoodie 1.png"; Out = "hoodie-1.png"; Threshold = 58; MinArea = 18000; Dark = $false },
  @{ In = "hoodie 2.png"; Out = "hoodie-2.png"; Threshold = 54; MinArea = 18000; Dark = $false },
  @{ In = "hoodie 3.png"; Out = "hoodie-3.png"; Threshold = 52; MinArea = 18000; Dark = $false },
  @{ In = "hoodie 4.png"; Out = "hoodie-4.png"; Threshold = 56; MinArea = 18000; Dark = $false },
  @{ In = "jacket.png"; Out = "jacket.png"; Threshold = 40; MinArea = 24000; Dark = $true }
)

foreach ($job in $jobs) {
  $inputPath = Join-Path $sourceDir $job.In
  $outputPath = Join-Path $outDir $job.Out
  if ($job.Copy) {
    [ClothingCutoutProcessor]::CopyAlpha($inputPath, $outputPath)
  } else {
    [ClothingCutoutProcessor]::Cutout($inputPath, $outputPath, $job.Threshold, $job.MinArea, $job.Dark)
  }
}
