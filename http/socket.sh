#java -jar rsc/rsc-0.9.1.jar --data 'Hello World' --route EchoService.echo --request ws://localhost:8081 --stacktrace --debug
java -jar rsc/rsc-0.9.1.jar --data 'Hello World' --route EchoService.echoStream --stream --request ws://localhost:8081 --stacktrace --debug
