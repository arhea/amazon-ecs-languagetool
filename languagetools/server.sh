#!/bin/bash

JAVA_MAX_MEMORY=${JAVA_MAX_MEMORY:-1024M}

cat > ./config.properties <<EOF
redisHost=${REDIS_HOST}
fasttextBinary=/usr/bin/fasttext
fasttextModel=/usr/share/fastText/lid.176.bin
EOF

java -Xmx${JAVA_MAX_MEMORY} -cp languagetool-server.jar org.languagetool.server.HTTPServer \
  --port 8080 \
  --public \
  --config ./config.properties \
  ${LT_OPTIONS}
