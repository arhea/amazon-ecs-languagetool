FROM amazoncorretto:11

ARG LT_VERSION=4.9.1
ARG FASTTEXT_VERSION=0.9.2

RUN yum update -y \
    && yum install -y bash libgomp gcc gcc-c++ make git unzip curl \
    && mkdir -p /usr/src/ \
    && git clone https://github.com/facebookresearch/fastText.git /tmp/fastText \
    && cd /tmp/fastText \
    && make \
    && mv ./fasttext /usr/bin/fasttext \
    && chmod +x /usr/bin/fasttext \
    && mkdir -p /usr/share/fastText \
    && curl -o /usr/share/fastText/lid.176.bin https://dl.fbaipublicfiles.com/fasttext/supervised-models/lid.176.bin \
    && cd /tmp \
    && rm -rf /tmp/fastText \
    && curl -O https://languagetool.org/download/LanguageTool-${LT_VERSION}.zip \
    && unzip LanguageTool-${LT_VERSION}.zip -d /tmp \
    && mv /tmp/LanguageTool-${LT_VERSION} /usr/src/languagetool \
    && rm -f LanguageTool-${LT_VERSION}.zip \
    && yum remove -y gcc gcc-c++ make git unzip \
    && yum clean all \
    && rm -rf /var/cache/yum

COPY server.sh /usr/src/languagetool

WORKDIR /usr/src/languagetool

EXPOSE 8080

ENTRYPOINT [ "/bin/bash" ]

CMD [ "/usr/src/languagetool/server.sh" ]
