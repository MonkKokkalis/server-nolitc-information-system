# server-nolitc-information-system
Node JS, Express JS, MongoDB
Web server for the NOLITC Information System. The MongoDB version used for the development is 3.6.2 for Windows 64 bit.

Pre-requisites:

 - NodeJS must be installed along with NPM; version 8.9.4 is the version used for development of this App.
 - Mongo DB version 3.6.2 must be installed for the database

The primary function of this app is to scan the file system on path:D://files and provide a list of all the files on that path for the
user to download. Refer to the client side repo to infer all the available functions that are currently available as of the moment.

for example: D:\files\registrar is the path for the registrar user's files; and under it are the directories for the videos, pdf,
microsoft word files and etc.

The primary relies on the Node Js File system api to scan the directories based on the parameters of the HTTP request. It uses the ASYNC
library to implement asynchronous operations to optimize server response times. Based upon the http request, the server will be able to
respond with the result of the operation conducted by the FS api and Async through Express.

Note - 
The server uses bcryptJS to encrypt the passwords when issuing a POST request to the server when creating a user.
