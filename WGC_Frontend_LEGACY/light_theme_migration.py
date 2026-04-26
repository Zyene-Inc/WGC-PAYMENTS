import os
import glob

app_dir = "/Users/pavanganta/Desktop/untitled folder/WGC Frontend/src/app"

replacements = {
    "bg-wgc-navy-900": "bg-wgc-white",
    "bg-wgc-navy-950": "bg-wgc-white",
    "bg-wgc-navy-800": "bg-wgc-navy-50",
    "border-wgc-navy-800": "border-wgc-navy-100",
    "border-wgc-navy-700": "border-wgc-navy-100",
    "border-wgc-white/5": "border-wgc-navy-100",
    "border-wgc-white/10": "border-wgc-navy-100",
    "border-wgc-white/20": "border-wgc-navy-200",
    "border-wgc-white/50": "border-wgc-navy-300",
    "border-wgc-white": "border-wgc-navy-900",
    "text-wgc-white": "text-wgc-navy-900",
    "text-wgc-navy-200": "text-wgc-navy-600",
    "text-wgc-navy-300": "text-wgc-navy-500",
    "text-wgc-gray-400": "text-wgc-navy-500",
    "ring-wgc-white/10": "ring-wgc-navy-100",
    "ring-wgc-white/20": "ring-wgc-navy-200",
    "hover:bg-wgc-navy-800": "hover:bg-wgc-navy-50",
    "hover:bg-white/5": "hover:bg-wgc-navy-50",
    "hover:text-wgc-white": "hover:text-wgc-navy-900",
    "hover:bg-wgc-navy-900": "hover:bg-wgc-navy-100",
    "text-wgc-navy-500": "text-wgc-navy-400",
}

def migrate_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    new_content = content
    for old, new in replacements.items():
        new_content = new_content.replace(old, new)
        
    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for root, _, files in os.walk(app_dir):
    for file in files:
        if file.endswith('.html') or file.endswith('.ts'):
            migrate_file(os.path.join(root, file))

print("Migration complete!")
