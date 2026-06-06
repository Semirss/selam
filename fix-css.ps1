$files = Get-ChildItem -Path 'src' -Recurse -Filter '*.tsx'

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw

    # Colors
    $content = [System.Text.RegularExpressions.Regex]::Replace($content, 'bg-\[var\(--(navy|teal|teal-light|teal-mid|off-white|surface|dark|gray|gray-light|danger|warning)\)\]', 'bg-$1')
    $content = [System.Text.RegularExpressions.Regex]::Replace($content, 'text-\[var\(--(navy|teal|teal-light|teal-mid|off-white|surface|dark|gray|gray-light|danger|warning)\)\]', 'text-$1')
    $content = [System.Text.RegularExpressions.Regex]::Replace($content, 'border-\[var\(--(navy|teal|teal-light|teal-mid|off-white|surface|dark|gray|gray-light|danger|warning)\)\]', 'border-$1')
    $content = [System.Text.RegularExpressions.Regex]::Replace($content, 'border-[lbtr]-\[var\(--(navy|teal|teal-light|teal-mid|off-white|surface|dark|gray|gray-light|danger|warning)\)\]', 'border-$1') 
    # Wait, border-l-$1 is correct.
    $content = [System.Text.RegularExpressions.Regex]::Replace($content, '(border-[a-z])-\[var\(--(navy|teal|teal-light|teal-mid|off-white|surface|dark|gray|gray-light|danger|warning)\)\]', '$1-$2')
    
    $content = [System.Text.RegularExpressions.Regex]::Replace($content, 'ring-\[var\(--(navy|teal|teal-light|teal-mid|off-white|surface|dark|gray|gray-light|danger|warning)\)\]', 'ring-$1')

    # Shadows and Radii
    $content = [System.Text.RegularExpressions.Regex]::Replace($content, 'shadow-\[var\(--shadow-(sm|md|lg)\)\]', 'shadow-$1')
    $content = [System.Text.RegularExpressions.Regex]::Replace($content, 'rounded-\[var\(--radius-(sm|md|lg|full)\)\]', 'rounded-$1')

    Set-Content -Path $file.FullName -Value $content -NoNewline
}

Write-Host "Replacement complete."
