$pages = @('/en', '/en/auth/login', '/en/about', '/en/pricing', '/en/auth/signup')
foreach ($page in $pages) {
    try {
        $resp = Invoke-WebRequest -Uri ("http://localhost:3000" + $page) -UseBasicParsing -TimeoutSec 10
        Write-Host ($page + " -> " + $resp.StatusCode) -ForegroundColor Green
    } catch {
        Write-Host ($page + " -> ERROR: " + $_.Exception.Message) -ForegroundColor Red
    }
}
