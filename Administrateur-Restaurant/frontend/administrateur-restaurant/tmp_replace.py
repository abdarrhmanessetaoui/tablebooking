import re
import os

files = [
    r"src\components\Tables\TableList.jsx",
    r"src\components\Services\ServiceList.jsx",
    r"src\components\Tables\TableLocationsManager.jsx",
    r"src\components\BlockedDates\BlockedDateList.jsx",
    r"src\components\Reservations\ReservationModal\modes\ViewMode.jsx",
    r"src\components\Reservations\ReservationsTable\MobileCard.jsx",
    r"src\styles\reservations\table.styles.js",
    r"src\pages\Settings.jsx"
]

for file in files:
    try:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        original_content = content

        # Replace 28x28 square buttons with circular minimal buttons
        content = re.sub(r"width:\s*28,\s*height:\s*28,\s*borderRadius:\s*6", "padding: 6, borderRadius: '50%'", content)
        content = re.sub(r"width: 28,\s*height: 28,\s*borderRadius: 6", "padding: 6, borderRadius: '50%'", content)

        # Replacements for ViewMode.jsx
        content = re.sub(r"width:\s*40,\s*height:\s*40,\s*borderRadius:\s*6", "padding: 10, borderRadius: '50%'", content)
        
        # MobileCard.jsx
        content = re.sub(r"width:36,\s*height:36,\s*borderRadius:6,\s*padding:0", "padding: 8, borderRadius: '50%'", content)

        if content != original_content:
            with open(file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated {file}")
            
    except Exception as e:
        print(f"Failed {file}: {e}")

print("Done")
