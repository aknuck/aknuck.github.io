import networkx as nx

G = nx.Graph()
G.add_node("bathroom")
G.add_node("cafeteria")

G.add_edge("bathroom", "cafeteria")


print([p for p in nx.all_shortest_paths(G, "bathroom", "cafeteria")])