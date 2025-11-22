function convertCode() {
    let python = document.getElementById("pythonCode").value;
    let c = python;

    // 🧩 Step 1: Convert Python control structures
    c = c.replace(/if (.*):/g, "if ($1) {");
    c = c.replace(/elif (.*):/g, "else if ($1) {");
    c = c.replace(/else:/g, "else {");
    c = c.replace(/for (\w+) in range\((\d+)\):/g, "for (int $1 = 0; $1 < $2; $1++) {");
    c = c.replace(/while (.*):/g, "while ($1) {");
    c = c.replace(/print\((.*)\)/g, "printf($1);");

    // 🧩 Step 2: Detect and convert variable assignments
    let lines = c.split("\n");
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();

        // Match variable assignment: x = 5
        let match = line.match(/^(\w+)\s*=\s*(.*)$/);
        if (match) {
            let varName = match[1];
            let value = match[2].trim();

            // Determine variable type
            if (/^".*"$/.test(value) || /^'.*'$/.test(value)) {
                lines[i] = `char ${varName}[] = ${value};`;
            } else if (/^\d+\.\d+$/.test(value)) {
                lines[i] = `float ${varName} = ${value};`;
            } else if (/^\d+$/.test(value)) {
                lines[i] = `int ${varName} = ${value};`;
            } else if (/^(True|False)$/i.test(value)) {
                lines[i] = `int ${varName} = ${value.toLowerCase() === "true" ? 1 : 0};`;
            } else {
                // For unknown values, assume integer or expression
                lines[i] = `int ${varName} = ${value};`;
            }
        }
    }

    c = lines.join("\n");

    // 🧩 Step 3: Add proper indentation
    c = c.replace(/\n/g, "\n    "); // indent inside main()

    // 🧩 Step 4: Wrap with C headers and main function
    let finalCode = 
`#include <stdio.h>

int main() {
    ${c}

    return 0;
}`;

    // 🧩 Step 5: Display final converted C code
    document.getElementById("cCode").textContent = finalCode;
}
