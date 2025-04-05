Aquí tienes los diagramas de secuencia en formato PlantUML para cada caso de uso. 
---

### **Caso de uso 1: Generar el árbol de archivos**
```plantuml
@startuml
actor Usuario
participant "VSCode UI" as UI
participant "Extensión" as Ext
participant "Sistema de Archivos" as FS

Usuario -> UI: Clic derecho en carpeta
UI -> Ext: Ejecuta "Generar árbol de archivos"
Ext -> FS: Obtener ruta de carpeta seleccionada
FS --> Ext: Ruta (ej: /proyecto)
Ext -> FS: Leer contenido de la carpeta
FS --> Ext: Lista de archivos/carpetas
Ext -> Ext: Generar árbol con formato (excluir según .gitignore)
Ext -> UI: Mostrar árbol en archivo/vista
UI --> Usuario: Árbol generado (tree.txt o panel)
@enduml
```

---

### **Caso de uso 2: Guardar el árbol en un archivo**
```plantuml
@startuml
actor Usuario
participant "VSCode UI" as UI
participant "Extensión" as Ext
participant "Sistema de Archivos" as FS

Usuario -> UI: Selecciona "Guardar árbol"
UI -> Ext: Solicita nombre/ubicación del archivo
Ext -> UI: Diálogo para ingresar nombre (ej: tree.txt)
Usuario -> UI: Ingresa nombre y confirma
Ext -> FS: Escribir árbol en archivo (ej: /proyecto/tree.txt)
FS --> Ext: Confirmación de escritura
Ext -> UI: Mostrar mensaje de éxito
UI --> Usuario: "Árbol guardado en tree.txt"
@enduml
```

---

### **Caso de uso 3: Excluir archivos/carpetas**
```plantuml
@startuml
actor Usuario
participant "VSCode UI" as UI
participant "Extensión" as Ext
participant "Sistema de Archivos" as FS

Usuario -> UI: Clic derecho en carpeta
UI -> Ext: Ejecuta "Generar árbol de archivos"
Ext -> FS: Leer .gitignore/.treeignore (más cercano)
FS --> Ext: Patrones de exclusión (ej: node_modules)
Ext -> FS: Leer contenido de carpeta (excluyendo patrones)
FS --> Ext: Lista filtrada de archivos/carpetas
Ext -> Ext: Generar árbol
Ext -> UI: Mostrar árbol filtrado
UI --> Usuario: Árbol sin elementos excluidos
@enduml
```

---

### **Caso de uso 4: Copiar al portapapeles**
```plantuml
@startuml
actor Usuario
participant "VSCode UI" as UI
participant "Extensión" as Ext
participant "Portapapeles" as Clip

Usuario -> UI: Selecciona "Copiar árbol"
UI -> Ext: Solicita copiar árbol
Ext -> Ext: Formatear árbol (texto plano/Markdown)
Ext -> Clip: Escribir texto en portapapeles
Clip --> Ext: Confirmación
Ext -> UI: Mostrar mensaje de éxito
UI --> Usuario: "Árbol copiado al portapapeles"
@enduml
```

---

### **Caso de uso 5: Mostrar en vista de VS Code**
```plantuml
@startuml
actor Usuario
participant "VSCode UI" as UI
participant "Extensión" as Ext
participant "Editor de Texto" as Editor

Usuario -> UI: Clic derecho en carpeta
UI -> Ext: Ejecuta "Generar árbol de archivos"
Ext -> Ext: Generar árbol con formato
Ext -> Editor: Abrir pestaña/Webview con el árbol
Editor --> UI: Mostrar contenido en nueva pestaña
UI --> Usuario: Árbol visible en VS Code (ej: preview.html)
@enduml
```
