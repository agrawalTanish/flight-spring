@echo off
setlocal
set "DIR=%~dp0"
set "MAVEN_HOME=%DIR%.mvn\apache-maven-3.9.6"
set "MAVEN_ZIP=%DIR%.mvn\maven.zip"
if not exist "%MAVEN_HOME%" (
    mkdir "%DIR%.mvn" 2>nul
    powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.6/apache-maven-3.9.6-bin.zip' -OutFile '%MAVEN_ZIP%'"
    powershell -Command "Expand-Archive -Path '%MAVEN_ZIP%' -DestinationPath '%DIR%.mvn'"
    del "%MAVEN_ZIP%"
)
"%MAVEN_HOME%\bin\mvn.cmd" %*
