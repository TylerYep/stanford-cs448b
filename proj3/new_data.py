count = -1
with open('restaurant.csv') as f:
    with open('new_restaurant.csv', 'w') as f2:
        for line in f:
            f2.write(str(count) + ',' + line)
            count += 1
