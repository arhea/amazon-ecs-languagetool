
build:
	docker image build -t arhea/languagetool:latest .

test: build
	docker container run -it --name languagetool-server --rm -p 8080:8080 arhea/languagetool:latest
