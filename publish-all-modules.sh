cd modules
for a in *; do cd "$a"; npm publish ; cd ..; done
cd ..
