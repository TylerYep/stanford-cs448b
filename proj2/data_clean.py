
with open('../../../Downloads/sf-crime/train.csv') as f:
    with open('../../../Downloads/sf-crime-year-12-14.csv', 'a') as f2:
        count = 0
        for line in f:
            if count > 249688: #   13 ends 177957:     #  14 ends 102351:
                break
            if count > 27585:
                f2.write(line)
            count += 1

        print(count)
