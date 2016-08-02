Chat using Sails.js & Angular.js
===================


He desarrollado una aplicación que sirve como API REST de un chat con una sola sala de usuarios online. Todos los usuarios que se registren, podrán charlar entre sí solo en una sala común (Por ahora).

----------


Pruebalo!
-------------
Para probar el código debes clonar el repositorio, instalar las dependencias y correr npm:
`git clone `
`npm install`
`bower install`
`npm start`
Este ultimo comando, activa `sails lift` y levanta el servidor web de sails http://localhost:1337/.

----------


Estructura de Código
-------------------
Para el proyecto, se crearon dos apps y ambas se encuentran en el mismo repo, sails.js automaticamente al levantar su servidor web también ofrece la app del frontend hecha en angular.

api
:    Logic of backend

app
:   Frontend app

assets
:    Statics files of Sails.js.

config
:    Config of Sails.js

task
:    Grunt tasks to configurations.

package.json
bower.js
gulpfile.js
gruntfile.js

----------
Aplicacion Backend
-------------

Sails.js fue el framework escogido para la realización de un api rest para el chat desarrollado. La principal ventaja de este es que ya automaticamente por modelo se crean los REST blueprints routes. Además la librería de sockets implementada por sails (sails.io.js) es de fácil uso.

Se crearon tres modelos, Users, Online y Chat. Users para registro y login de usuarios. Online para registrar los usuarios que actualmente se encontraban online y Chat para los mensajes del chat publico.

La autenticación implementada fue utilizando tokens con la librería jsonwebtoken.

----------
Aplicacion Frontend
-------------

Se utilizo Angular.js como framework. Se estructuro la app de tal forma que se pudiera manejar cada vista como componentes principales, y si aplicaba una carpeta de components para directivas y sus templates de tal forma de que fuera utilizado por otros componentes.

Se utilizo Gulp para poder concatenar y minificar el código y así poder generar solo dos archivos de css (vendors.css y app.css) y de js (vendors.js y app.js).

De igual forma, para poder realizar la comunicación de nuestra aplicación client con el backend se implemento Sails.io.js, una librería cliente de sails para conectarse con su librería de socket.io.

----------
