import pandas as pd
import networkx as nx
from sklearn.neighbors import NearestNeighbors
import numpy as np
import csv
from tqdm import tqdm


def get_month_and_year():
    first_line = True
    with open('data/accidents_ca.csv') as f:
        with open('data/accidents_ca_with_date.csv', 'w') as new_f:
            for line in f:
                if first_line:
                    new_f.write(line[:-1] + ',year,month,day,hour\n')
                    first_line = False
                else:
                    split_line = line.split(',')
                    date = str(split_line[4])
                    split_date = date.split('-')
                    year = split_date[0]
                    month = split_date[1]
                    split_second_half = split_date[2].split(' ')
                    day = split_second_half[0]
                    split_time = split_second_half[1].split(':')
                    hour = split_time[0]
                    new_f.write(line[:-1] + ',' + year + ',' + month + ',' + day + ',' + hour + '\n')


def get_month_and_severity_counts():
    first_line = True
    data = [ [0] * 4 for _ in range(12)]
    with open('data/accidents_ca_with_date.csv') as f:
        for line in f:
            if first_line:
                first_line = False
            else:
                split_line = line.split(',')
                year = int(split_line[-4])
                if year == 2019:
                    month = int(split_line[-3])
                    severity = int(split_line[3])
                    data[month-1][severity-1] += 1
    print(data)


def remove_duplicates():
    first_line = True
    seen_coords = {}
    with open('data/accidents_bay_area.csv') as f:
        for line in f:
            if first_line:
                first_line = False
            else:
                split_line = line.split(',')
                latitude = float(split_line[6])
                longitude = float(split_line[7])
                str_form = str(latitude) + ',' + str(longitude)
                if str_form not in seen_coords:
                    seen_coords[str_form] = 0
                seen_coords[str_form] += 1

    first_line = True
    with open('data/accidents_bay_area.csv') as f:
        with open('data/accidents_bay_area_no_duplicates.csv', 'w') as new_f:
            for line in f:
                if first_line:
                    new_f.write(line[:-1] + ',Count\n')
                    first_line = False
                else:
                    split_line = line.split(',')
                    latitude = float(split_line[6])
                    longitude = float(split_line[7])
                    str_form = str(latitude) + ',' + str(longitude)
                    if str_form in seen_coords:
                        new_f.write(line[:-1] + ',' + str(seen_coords[str_form]) + '\n')
                        del seen_coords[str_form]


def get_ca_entries():
    first_line = True
    with open('data/US_Accidents_Dec19.csv') as f:
        with open('data/accidents_ca.csv', 'w') as new_f:
            for line in f:
                if first_line or ',CA,' in line:
                    new_f.write(line)
                    first_line = False


def get_bay_area_locations():
    first_line = True
    with open('data/accidents_ca.csv') as f:
        with open('data/accidents_bay_area.csv', 'w') as new_f:
            for line in f:
                if first_line:
                    new_f.write(line)
                    first_line = False
                else:
                    split_line = line.split(',')
                    latitude = float(split_line[6])
                    longitude = float(split_line[7])
                    if 37.189396 < latitude < 37.786233 and -122.49018 < longitude < -121.705327:
                        new_f.write(line)
                        first_line = False


def create_graph(k=10, radius=None):
    point_file = 'data/accidents_bay_area.csv'
    output_file = 'data/graph_bay_area_{}.csv'

    coords, rids = [], []
    with open(point_file) as csvfile:
        reader = csv.reader(csvfile, delimiter=',')
        hdr = next(reader, None) # skip header
        x_idx = hdr.index("Start_Lat")
        y_idx = hdr.index("Start_Lng")
        for row in tqdm(reader):
            rid = row[0]
            x = row[x_idx].replace(",","")
            y = row[y_idx].replace(",","")

            coords.append([float(x), float(y)])
            rids.append(rid)

    x = np.array(coords)
    print(x.shape)

    print("Begin Nearest Neighbors...")
    if radius:
        nbrs = NearestNeighbors(radius=radius, algorithm='auto').fit(np.array(x))
        A = nbrs.radius_neighbors_graph(x, mode="distance").toarray()
    else:
        nbrs = NearestNeighbors(n_neighbors=k, algorithm='auto').fit(np.array(x))
        A = nbrs.kneighbors_graph(x, mode="distance").toarray()

    print(np.sum(A))
    print("Fix graph...")
    # make the kNN graph undirected
    G = nx.convert_matrix.from_numpy_matrix(A)
    print("Make graph undirected...")
    G = G.to_undirected()
    print("Remove self-loops...")
    G.remove_edges_from(G.selfloop_edges())
    print(G)

    print("Relabeling...")
    # node ids should be actual node ids
    rid_map = {i : rid for i, rid in enumerate(rids)}
    nx.relabel_nodes(G, rid_map, copy=False)

    print("Writing New File...")
    if radius:
        outputStr = "radius_{}".format(radius)
    else:
        outputStr = "knn_{}".format(k)

    out_file = output_file.format(outputStr)
    with open(out_file, 'wb+') as fout:
        nx.write_edgelist(G, fout, data=True)
    convert_graph_to_csv(out_file)


def convert_graph_to_csv(filename):
    with open(filename) as f:
        with open(filename[:-4] + 'converted.csv', 'w') as new_f:
            new_f.write('p1,p2,weight\n')
            for line in f:
                line = line.replace("{'weight': ", '')[:-2]
                new_f.write(','.join(line.split(' ')) + '\n')


if __name__ == '__main__':
    # create_graph()
    # remove_duplicates()
    # convert_graph_to_csv('data/graph_bay_area_knn_5.csv')
    # get_bay_area_locations()
    # get_month_and_year()
    get_month_and_severity_counts()
