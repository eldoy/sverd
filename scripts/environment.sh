name=$1
pattern=$2
shift
shift
value=$*

sed -i s~$pattern~"$value"~g $name
