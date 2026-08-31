$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$sourceDir = Join-Path $PSScriptRoot "..\public\models\clothing"
$outDir = Join-Path $sourceDir "processed\collection"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$code = @"
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;

public static class CollectionCutouts
{
    struct Pt { public int X; public int Y; public Pt(int x, int y) { X = x; Y = y; } }

    public static string Process(string inputPath, string outputPath)
    {
        using (var src = new Bitmap(inputPath))
        using (var dst = new Bitmap(src.Width, src.Height, PixelFormat.Format32bppArgb))
        {
            int w = src.Width;
            int h = src.Height;
            var bg = new bool[w * h];
            var visited = new bool[w * h];
            var q = new Queue<Pt>(w + h);

            Action<int,int> seed = (x, y) => {
                int index = y * w + x;
                if (visited[index]) return;
                visited[index] = true;
                q.Enqueue(new Pt(x, y));
            };

            for (int x = 0; x < w; x++) { seed(x, 0); seed(x, h - 1); }
            for (int y = 0; y < h; y++) { seed(0, y); seed(w - 1, y); }

            while (q.Count > 0)
            {
                Pt p = q.Dequeue();
                int index = p.Y * w + p.X;
                if (!IsCheckerBackground(src.GetPixel(p.X, p.Y))) continue;

                bg[index] = true;
                if (p.X > 0) seed(p.X - 1, p.Y);
                if (p.X < w - 1) seed(p.X + 1, p.Y);
                if (p.Y > 0) seed(p.X, p.Y - 1);
                if (p.Y < h - 1) seed(p.X, p.Y + 1);
            }

            int transparent = 0;
            for (int y = 0; y < h; y++)
            {
                for (int x = 0; x < w; x++)
                {
                    int index = y * w + x;
                    Color c = src.GetPixel(x, y);
                    if (bg[index])
                    {
                        dst.SetPixel(x, y, Color.FromArgb(0, c.R, c.G, c.B));
                        transparent++;
                        continue;
                    }

                    bool edge = false;
                    for (int oy = -1; oy <= 1; oy++)
                    {
                        for (int ox = -1; ox <= 1; ox++)
                        {
                            int nx = x + ox;
                            int ny = y + oy;
                            if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
                            if (bg[ny * w + nx]) edge = true;
                        }
                    }

                    int alpha = edge ? 226 : 255;
                    dst.SetPixel(x, y, Color.FromArgb(alpha, c.R, c.G, c.B));
                }
            }

            dst.Save(outputPath, ImageFormat.Png);
            return String.Format("{0}: transparentPixels={1}/{2}", Path.GetFileName(inputPath), transparent, w * h);
        }
    }

    static bool IsCheckerBackground(Color c)
    {
        int max = Math.Max(c.R, Math.Max(c.G, c.B));
        int min = Math.Min(c.R, Math.Min(c.G, c.B));
        double lum = 0.2126 * c.R + 0.7152 * c.G + 0.0722 * c.B;
        return (max - min) <= 22 && lum >= 72;
    }
}
"@

Add-Type -TypeDefinition $code -ReferencedAssemblies System.Drawing

Get-ChildItem -LiteralPath $sourceDir -Filter *.png |
  Where-Object { $_.Name -match '^(hoodie|tshirt|shirt|jacket|trousers|coat)-0[1-4]\.png$' } |
  Sort-Object Name |
  ForEach-Object {
    [CollectionCutouts]::Process($_.FullName, (Join-Path $outDir $_.Name))
  }
