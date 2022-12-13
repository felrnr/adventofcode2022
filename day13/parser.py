with open('day13/input_test.txt') as f:
    lines = [l.strip() for l in f.readlines() if l != '\n']

# eval replacement
def parseline(line, i):
    if i >= len(line):
        raise Exception("out of bounds")
    
    # numbers
    if line[i].isdigit():
        value = ''
        while line[i].isdigit():
            value += line[i]
            i+=1
        return int(value), i
            
    # lists
    if line[i] == "[":
        value = list()
        i+=1
        
        while True:
            if line[i] == "]":
                return value, i+1
            elif line[i] == "[" or line[i].isdigit():
                new_item, i = parseline(line, i)
                value.append(new_item)
            else:
                i+=1

    raise Exception("Malformed input")

# Test
import json
for l in lines:
    jl = json.dumps(parseline(l,0)[0], separators=(',', ':'))
    print(l == jl)
    print(l)
    print("")
