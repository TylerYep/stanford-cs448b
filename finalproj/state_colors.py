from tqdm import tqdm
from collections import Counter


def create_graph():
    first_line = True
    counts_dict = Counter()
    with open('data/US_Accidents_Dec19.csv') as f:
        for line in tqdm(f):
            if first_line:
                first_line = False
                continue
            arr = line.split(',')
            state = arr[17]
            counts_dict[state] += 1

    print(counts_dict)


if __name__ == '__main__':
    create_graph()