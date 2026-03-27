param(
  [string]$Root = (Split-Path -Parent $MyInvocation.MyCommand.Path),
  [int]$Port = 4173
)

$ErrorActionPreference = "Stop"

function Get-ContentType([string]$Path) {
  switch ([IO.Path]::GetExtension($Path).ToLowerInvariant()) {
    ".html" { return "text/html; charset=utf-8" }
    ".css" { return "text/css; charset=utf-8" }
    ".js" { return "application/javascript; charset=utf-8" }
    ".json" { return "application/json; charset=utf-8" }
    ".png" { return "image/png" }
    ".jpg" { return "image/jpeg" }
    ".jpeg" { return "image/jpeg" }
    ".svg" { return "image/svg+xml" }
    default { return "application/octet-stream" }
  }
}

$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $Port)
$listener.Start()

try {
  while ($true) {
    $client = $listener.AcceptTcpClient()
    try {
      $stream = $client.GetStream()
      $reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::ASCII, $false, 1024, $true)
      $requestLine = $reader.ReadLine()

      if ([string]::IsNullOrWhiteSpace($requestLine)) {
        $client.Close()
        continue
      }

      while ($true) {
        $line = $reader.ReadLine()
        if ([string]::IsNullOrEmpty($line)) { break }
      }

      $parts = $requestLine.Split(" ")
      $path = if ($parts.Length -ge 2) { $parts[1] } else { "/" }
      $path = $path.Split("?")[0]
      if ($path -eq "/") { $path = "/index.html" }

      $relativePath = $path.TrimStart("/").Replace("/", "\")
      $filePath = Join-Path $Root $relativePath

      if (-not (Test-Path -LiteralPath $filePath -PathType Leaf)) {
        $body = [System.Text.Encoding]::UTF8.GetBytes("Not Found")
        $headers = "HTTP/1.1 404 Not Found`r`nContent-Type: text/plain; charset=utf-8`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n`r`n"
        $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($headers)
        $stream.Write($headerBytes, 0, $headerBytes.Length)
        $stream.Write($body, 0, $body.Length)
        $stream.Flush()
        $client.Close()
        continue
      }

      $body = [System.IO.File]::ReadAllBytes($filePath)
      $headers = "HTTP/1.1 200 OK`r`nContent-Type: $(Get-ContentType $filePath)`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n`r`n"
      $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($headers)
      $stream.Write($headerBytes, 0, $headerBytes.Length)
      $stream.Write($body, 0, $body.Length)
      $stream.Flush()
      $client.Close()
    }
    finally {
      if ($client.Connected) {
        $client.Close()
      }
    }
  }
}
finally {
  $listener.Stop()
}
