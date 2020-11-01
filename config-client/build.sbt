lazy val root = (project in file(".")).
  settings(
    organization := "org.gluu",
    name := "casa-config-client",
    version := "5.0.0-SNAPSHOT",
    scalaVersion := "2.11.4",
    scalacOptions ++= Seq("-feature"),
    javacOptions in compile ++= Seq("-Xlint:deprecation"),
    publishArtifact in (Compile, packageDoc) := false,
    resolvers += Resolver.mavenLocal,
    libraryDependencies ++= Seq(
      "io.swagger" % "swagger-annotations" % "1.5.8",
      "org.glassfish.jersey.core" % "jersey-client" % "2.22.2",
      "org.glassfish.jersey.media" % "jersey-media-multipart" % "2.22.2",
      "org.glassfish.jersey.media" % "jersey-media-json-jackson" % "2.22.2",
      "com.fasterxml.jackson.core" % "jackson-core" % "2.10.1",
      "com.fasterxml.jackson.core" % "jackson-annotations" % "2.10.1",
      "com.fasterxml.jackson.core" % "jackson-databind" % "2.10.1",
	  "com.fasterxml.jackson.datatype" % "jackson-datatype-jsr310" % "2.10.1",
      "junit" % "junit" % "4.12" % "test",
      "com.novocode" % "junit-interface" % "0.10" % "test"
    )
  )
