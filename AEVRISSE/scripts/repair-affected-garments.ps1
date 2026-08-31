$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$sourceDir = Join-Path $PSScriptRoot "..\public\models\clothing"
$cleanDir = Join-Path $sourceDir "clean"
$affected = @(
  "tshirt-02.png",
  "tshirt-03.png",
  "shirt-01.png",
  "jacket-04.png"
)

$code = @"
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;

public static class FocusedGarmentRepair
{
    struct Pt { public int X; public int Y; public Pt(int x, int y) { X = x; Y = y; } }

    public static void Repair(string inputPath, string outputPath)
    {
        using (var src = new Bitmap(inputPath))
        using (var dst = new Bitmap(src.Width, src.Height, PixelFormat.Format32bppArgb))
        {
            int w = src.Width;
            int h = src.Height;
            string name = Path.GetFileName(inputPath);
            int neutralTolerance = name == "jacket-04.png" ? 16 : 12;
            int paletteDistanceSquared = name == "jacket-04.png" ? 400 : 144;
            bool[] bg = ConnectedCheckerBackground(src, neutralTolerance, paletteDistanceSquared);
            RemoveSmallDetachedForeground(bg, w, h);

            for (int y = 0; y < h; y++)
            {
                for (int x = 0; x < w; x++)
                {
                    Color c = src.GetPixel(x, y);
                    if (bg[y * w + x])
                    {
                        dst.SetPixel(x, y, Color.FromArgb(0, c.R, c.G, c.B));
                    }
                    else
                    {
                        int alpha = HasBackgroundNeighbor(bg, x, y, w, h) ? 238 : 255;
                        dst.SetPixel(x, y, Color.FromArgb(alpha, c.R, c.G, c.B));
                    }
                }
            }

            dst.Save(outputPath, ImageFormat.Png);
        }
    }

    static bool[] ConnectedCheckerBackground(Bitmap src, int neutralTolerance, int paletteDistanceSquared)
    {
        int w = src.Width;
        int h = src.Height;
        var bg = new bool[w * h];
        var visited = new bool[w * h];
        var queue = new Queue<Pt>(w + h);
        var palette = BorderPalette(src, neutralTolerance);

        Action<int,int> seed = (x, y) => {
            int index = y * w + x;
            if (visited[index]) return;
            visited[index] = true;
            queue.Enqueue(new Pt(x, y));
        };

        for (int x = 0; x < w; x++) { seed(x, 0); seed(x, h - 1); }
        for (int y = 0; y < h; y++) { seed(0, y); seed(w - 1, y); }

        while (queue.Count > 0)
        {
            Pt p = queue.Dequeue();
            int index = p.Y * w + p.X;
            if (!IsCheckerBackground(src.GetPixel(p.X, p.Y), palette, neutralTolerance, paletteDistanceSquared)) continue;

            bg[index] = true;
            if (p.X > 0) seed(p.X - 1, p.Y);
            if (p.X < w - 1) seed(p.X + 1, p.Y);
            if (p.Y > 0) seed(p.X, p.Y - 1);
            if (p.Y < h - 1) seed(p.X, p.Y + 1);
        }

        return bg;
    }

    static List<Color> BorderPalette(Bitmap src, int neutralTolerance)
    {
        int w = src.Width;
        int h = src.Height;
        var buckets = new Dictionary<int, int>();

        Action<Color> add = c => {
            if (!IsStrictNeutral(c, neutralTolerance)) return;
            int key = (c.R / 8) * 65536 + (c.G / 8) * 256 + (c.B / 8);
            buckets[key] = buckets.ContainsKey(key) ? buckets[key] + 1 : 1;
        };

        int stepX = Math.Max(1, w / 360);
        int stepY = Math.Max(1, h / 240);
        for (int x = 0; x < w; x += stepX)
        {
            add(src.GetPixel(x, 0));
            add(src.GetPixel(x, h - 1));
        }
        for (int y = 0; y < h; y += stepY)
        {
            add(src.GetPixel(0, y));
            add(src.GetPixel(w - 1, y));
        }

        var top = new List<KeyValuePair<int, int>>(buckets);
        top.Sort((a, b) => b.Value.CompareTo(a.Value));
        var colors = new List<Color>();
        for (int i = 0; i < Math.Min(12, top.Count); i++)
        {
            int r = ((top[i].Key / 65536) * 8) + 4;
            int g = (((top[i].Key / 256) % 256) * 8) + 4;
            int b = ((top[i].Key % 256) * 8) + 4;
            colors.Add(Color.FromArgb(Math.Min(255, r), Math.Min(255, g), Math.Min(255, b)));
        }
        return colors;
    }

    static bool IsStrictNeutral(Color c, int neutralTolerance)
    {
        int max = Math.Max(c.R, Math.Max(c.G, c.B));
        int min = Math.Min(c.R, Math.Min(c.G, c.B));
        double lum = 0.2126 * c.R + 0.7152 * c.G + 0.0722 * c.B;
        return (max - min) <= neutralTolerance && lum >= 38;
    }

    static bool IsCheckerBackground(Color c, List<Color> palette, int neutralTolerance, int paletteDistanceSquared)
    {
        if (!IsStrictNeutral(c, neutralTolerance)) return false;
        foreach (Color p in palette)
        {
            int dr = c.R - p.R;
            int dg = c.G - p.G;
            int db = c.B - p.B;
            if ((dr * dr + dg * dg + db * db) <= paletteDistanceSquared) return true;
        }
        return false;
    }

    static void RemoveSmallDetachedForeground(bool[] bg, int w, int h)
    {
        var visited = new bool[w * h];
        var queue = new Queue<Pt>();
        var component = new List<int>();
        int minArea = Math.Max(1600, (w * h) / 1300);

        for (int y = 0; y < h; y++)
        {
            for (int x = 0; x < w; x++)
            {
                int start = y * w + x;
                if (bg[start] || visited[start]) continue;

                visited[start] = true;
                queue.Enqueue(new Pt(x, y));
                component.Clear();

                while (queue.Count > 0)
                {
                    Pt p = queue.Dequeue();
                    int index = p.Y * w + p.X;
                    component.Add(index);
                    VisitForeground(p.X - 1, p.Y, bg, visited, queue, w, h);
                    VisitForeground(p.X + 1, p.Y, bg, visited, queue, w, h);
                    VisitForeground(p.X, p.Y - 1, bg, visited, queue, w, h);
                    VisitForeground(p.X, p.Y + 1, bg, visited, queue, w, h);
                }

                if (component.Count < minArea)
                {
                    foreach (int index in component) bg[index] = true;
                }
            }
        }
    }

    static void VisitForeground(int x, int y, bool[] bg, bool[] visited, Queue<Pt> queue, int w, int h)
    {
        if (x < 0 || y < 0 || x >= w || y >= h) return;
        int index = y * w + x;
        if (bg[index] || visited[index]) return;
        visited[index] = true;
        queue.Enqueue(new Pt(x, y));
    }

    static bool HasBackgroundNeighbor(bool[] bg, int x, int y, int w, int h)
    {
        for (int oy = -1; oy <= 1; oy++)
        {
            for (int ox = -1; ox <= 1; ox++)
            {
                int nx = x + ox;
                int ny = y + oy;
                if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
                if (bg[ny * w + nx]) return true;
            }
        }
        return false;
    }
}
"@

Add-Type -TypeDefinition $code -ReferencedAssemblies System.Drawing

foreach ($name in $affected) {
  $inputPath = Join-Path $sourceDir $name
  $outputPath = Join-Path $cleanDir $name
  [FocusedGarmentRepair]::Repair($inputPath, $outputPath)
  Write-Output "Repaired $name"
}
