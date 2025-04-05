
#### **Caso de uso 1: Generar el árbol de archivos de una carpeta**
1. **Descripción**:
   - El usuario hace clic derecho sobre una carpeta en el explorador de archivos de VS Code.
   - La extensión genera un árbol de archivos y lo muestra en un archivo de texto o en una vista dentro de VS Code.

2. **Flujo principal**:
   1. El usuario selecciona una carpeta en el explorador de archivos de VS Code.
   2. El usuario hace clic derecho sobre la carpeta y selecciona la opción **"Generar árbol de archivos"**.
   3. La extensión obtiene la ruta de la carpeta seleccionada.
   4. La extensión recorre recursivamente la estructura de archivos y carpetas dentro de la carpeta seleccionada.
   5. La extensión genera una representación en texto del árbol de archivos, con un formato legible (por ejemplo, el formato de la salida del comando unix `tree`).
   6. La extensión muestra el árbol generado:
      - En un archivo de texto (`tree.txt`) dentro de la carpeta seleccionada.
      - O en una vista dentro de VS Code (por ejemplo, en una pestaña o panel).

3. **Flujos alternativos**:
   - **Exclusión de archivos o carpetas**: El usuario puede configurar la extensión para excluir ciertos archivos o carpetas (por ejemplo, `node_modules`, `.git`, etc.). Esta posibilidad añade la opción de ignorar todos los archivos y carpetas incluidos en el .gitignore si es que existe. Para ello considera el .gitignore más cercano a la carpeta seleccionada.
   - **Profundidad del árbol**: El usuario puede especificar la profundidad máxima del árbol (por ejemplo, solo mostrar archivos y carpetas hasta un cierto nivel de profundidad).
   - **Manejo de errores**: Si ocurre un error (por ejemplo, la carpeta está vacía o no se tienen permisos), la extensión muestra un mensaje de error al usuario.

4. **Requisitos no funcionales**:
   - La extensión debe ser rápida y no bloquear la interfaz de VS Code mientras genera el árbol.
   - El árbol generado debe ser legible y fácil de entender.




#### **Caso de uso 2: Guardar el árbol de archivos en un archivo**
1. **Descripción**:
   - El usuario puede elegir guardar el árbol de archivos generado en un archivo de texto (por ejemplo, `tree.txt`) dentro de la carpeta seleccionada.

2. **Flujo principal**:
   1. El usuario selecciona una carpeta en el explorador de archivos de VS Code.
   2. El usuario hace clic derecho sobre la carpeta y selecciona la opción **"Generar árbol de archivos"**.
   3. La extensión genera el árbol de archivos y muestra una opción para guardarlo en un archivo.
   4. El usuario elige guardar el árbol en un archivo de texto.
   5. La extensión guarda el árbol generado en un archivo de texto (por ejemplo, `tree.txt`) dentro de la carpeta seleccionada.
   6. La extensión muestra un mensaje de confirmación al usuario (por ejemplo, "El árbol de archivos se ha guardado en `tree.txt`").

3. **Flujos alternativos**:
   - **Personalización del nombre del archivo**: El usuario puede elegir el nombre del archivo de salida (por ejemplo, `estructura.txt`).
   - **Ubicación del archivo**: El usuario puede elegir la ubicación del archivo de salida (por ejemplo, en una subcarpeta específica).
   - **Sobrescritura del archivo**: Si el archivo ya existe, la extensión pregunta al usuario si desea sobrescribirlo o crear una nueva versión.
   - **Formato del archivo**: El usuario puede elegir el formato del archivo de salida (por ejemplo, texto plano, Markdown, JSON, etc.).
   - **Inclusión de metadatos**: El usuario puede incluir metadatos en el archivo, como la fecha de generación o la ruta de la carpeta analizada.

4. **Requisitos no funcionales**:
   - La extensión debe ser rápida y no bloquear la interfaz de VS Code mientras guarda el archivo.
   - El archivo generado debe ser legible y fácil de entender.





#### **Caso de uso 3: Excluir archivos o carpetas específicos**
1. **Descripción**:
   - El usuario puede configurar la extensión para excluir ciertos archivos o carpetas (por ejemplo, `node_modules`, `.git`, etc.) al generar el árbol de archivos.

2. **Flujo principal**:
   1. El usuario selecciona una carpeta en el explorador de archivos de VS Code.
   2. El usuario hace clic derecho sobre la carpeta y selecciona la opción **"Generar árbol de archivos"**.
   3. La extensión verifica si hay exclusiones configuradas (por ejemplo, en un archivo `.treeignore` o `.gitignore` o en la configuración de VS Code).
   4. La extensión genera el árbol de archivos, omitiendo aquellos que coincidan con los patrones de exclusión.
   5. La extensión muestra el árbol generado (por ejemplo, en un archivo de texto o en una vista dentro de VS Code).

3. **Flujos alternativos**:
   - **Configuración de exclusiones**: El usuario puede configurar exclusiones a través de un archivo `.treeignore` o desde la interfaz de configuración de VS Code.
   - **Exclusiones por defecto**: La extensión aplica exclusiones por defecto (por ejemplo, `node_modules`, `.git`, etc.), pero el usuario puede modificarlas.
   - **Integración con `.gitignore`**: La extensión puede usar el archivo `.gitignore` del proyecto para excluir archivos o carpetas.
   - **Uso de archivo `.gitignore`: Se puede configura la opción de usar el archivo `.gitignore` más cercano a la carpeta seleccionada o usar el archivo `.gitignore` del proyecto ubicado en la carpeta raiz. Esto debe ser configurable desde la interfaz de configuración de VS Code.

4. **Requisitos no funcionales**:
   - La extensión debe ser rápida y no bloquear la interfaz de VS Code mientras genera el árbol.
   - Las exclusiones deben aplicarse de manera eficiente, sin afectar el rendimiento de la extensión.




#### **Caso de uso 4: Copiar el árbol de archivos al portapapeles**
1. **Descripción**:
   - El usuario puede copiar el árbol de archivos generado al portapapeles para pegarlo en otro lugar.

2. **Flujo principal**:
   1. El usuario selecciona una carpeta en el explorador de archivos de VS Code.
   2. El usuario hace clic derecho sobre la carpeta y selecciona la opción **"Generar árbol de archivos"**.
   3. La extensión genera el árbol de archivos.
   4. La extensión copia el árbol generado al portapapeles.
   5. La extensión muestra un mensaje de confirmación al usuario (por ejemplo, "El árbol de archivos se ha copiado al portapapeles").

3. **Flujos alternativos**:
   - **Formato del árbol copiado**: El usuario puede elegir el formato del árbol copiado (por ejemplo, texto plano, Markdown, JSON, etc.).
   - **Inclusión de metadatos**: El usuario puede incluir metadatos en el árbol copiado (por ejemplo, la fecha de generación o la ruta de la carpeta analizada).
   - **Integración con otros casos de uso**: El usuario puede copiar el árbol al portapapeles después de generarlo, incluso si también elige guardarlo en un archivo o mostrarlo en una vista.

4. **Requisitos no funcionales**:
   - La extensión debe ser rápida y no bloquear la interfaz de VS Code mientras copia el árbol al portapapeles.
   - El árbol copiado debe ser legible y fácil de entender.


#### **Caso de uso 5: Mostrar el árbol de archivos en una vista de VS Code**
1. **Descripción**:
   - El árbol de archivos se muestra en una pestaña o panel dentro de VS Code, en lugar de solo guardarlo en un archivo.

2. **Flujo principal**:
   1. El usuario selecciona una carpeta en el explorador de archivos de VS Code.
   2. El usuario hace clic derecho sobre la carpeta y selecciona la opción **"Generar árbol de archivos"**.
   3. La extensión genera el árbol de archivos.
   4. La extensión abre una nueva pestaña o panel dentro de VS Code para mostrar el árbol generado.
   5. El usuario puede interactuar con el árbol (por ejemplo, copiar, guardar, o hacer clic en archivos para abrirlos).

3. **Flujos alternativos**:
   - **Formato del árbol**: El usuario puede elegir el formato del árbol (por ejemplo, texto plano, Markdown, JSON, etc.).
   - **Interacción con el árbol**: Si el árbol se muestra en una vista personalizada, el usuario puede hacer clic en los archivos o carpetas para abrirlos directamente.
   - **Actualización automática**: El usuario puede actualizar el árbol si la estructura de archivos cambia.
   - **Integración con otros casos de uso**: El usuario puede guardar el árbol en un archivo o copiarlo al portapapeles directamente desde la vista.

4. **Requisitos no funcionales**:
   - La extensión debe ser rápida y no bloquear la interfaz de VS Code mientras genera y muestra el árbol.
   - La vista del árbol debe ser legible y fácil de entender.

