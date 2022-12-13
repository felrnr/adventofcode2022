with open('day13/input.txt') as f:
    data = f.read().strip()

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

def cmp(a,b):
    if isinstance(a, int) and isinstance(b, int):
        return a-b
    
    left = [a] if isinstance(a,int) else a
    right = [b] if isinstance(b,int) else b

    for l,r in zip(left,right):
        result = cmp(l,r)
        if result != 0:
            return result
    
    return len(left) - len(right)


#  Part 1
pairs = [[parseline(l,0)[0] for l in p.split("\n")] for p in data.split("\n\n")]
s = sum([i for i,(l,r) in enumerate(pairs, start=1) if cmp(l,r) <= 0])
print(f"Part 1: {s}")


# Part 2
def insertion_sort(arr):
    i=0
    while i < len(arr):
        j = i
        while j > 0 and cmp(arr[j-1], arr[j]) > 0:
            arr[j-1], arr[j] = arr[j], arr[j-1]
            j -= 1
        i += 1
    return arr

packets = [l for l in data.splitlines() if l.strip() != ''] + ['[[2]]','[[6]]']
packets = insertion_sort([parseline(l,0)[0] for l in packets])

distressSignal = 1
for i,packet in enumerate(packets, start=1):
    if cmp(packet, [[2]]) == 0 or cmp(packet, [[6]]) == 0:
        distressSignal *= i
    
print(f"Part2 {distressSignal}")
