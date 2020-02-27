first_line = True
with open('data/US_Accidents_Dec19.csv') as f:
    with open('data/accidents_ca.csv', 'w') as new_f:
        for line in f:
            if first_line or ',CA,' in line:
                new_f.write(line)
                first_line = False
