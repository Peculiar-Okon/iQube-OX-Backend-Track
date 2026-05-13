# Week 1&2: Internet Foundations & Algorithms

## Overview
This repository contains my Week 1&2 assignments on internet foundations, networking concepts, Linux basics, and algorithms.

---

## Networking & Systems

### OSI Model
The OSI (Open Systems Interconnection) model is a 7-layer framework used to explain how data moves through a network.

Layers:
1. Physical Layer - Handles hardware transmission of raw bits.
2. Data Link Layer - Handles node-to-node communication and MAC addresses.
3. Network Layer - Responsible for routing using IP addresses.
4. Transport Layer - Ensures reliable delivery using TCP/UDP.
5. Session Layer - Manages sessions between applications.
6. Presentation Layer - Handles encryption, formatting, and translation.
7. Application Layer - Closest to users, includes HTTP, FTP, SMTP.

---

### DNS
DNS (Domain Name System) translates human-readable domain names into IP addresses.

Example:
google.com → 142.250.x.x

How DNS works:
1. Browser checks cache
2. Request sent to DNS resolver
3. Resolver checks root server
4. Root points to TLD server (.com)
5. TLD points to authoritative server
6. IP address returned

---

### HTTP Versions

#### HTTP/1.1
- Traditional request-response model
- One request per connection mostly
- Slower due to head-of-line blocking

#### HTTP/2
- Multiplexing support
- Header compression
- Faster than HTTP/1.1

#### HTTP/3
- Uses QUIC protocol over UDP
- Faster handshake
- Reduced latency
- Better for unstable/mobile networks

---

### Linux Installation Setup
Linux was installed using a Virtual Machine.

Steps:
1. Installed VirtualBox
2. Downloaded Ubuntu ISO
3. Created new virtual machine
4. Allocated RAM and storage
5. Mounted ISO image
6. Completed Ubuntu installation

---

## Algorithms & Problem Solving

### Common Sorting Algorithms

#### Bubble Sort
Repeatedly swaps adjacent elements until sorted.

Time Complexity:
O(n²)

#### Insertion Sort
Builds sorted array one element at a time.

Time Complexity:
O(n²)

#### Selection Sort
Finds minimum element and places it correctly.

Time Complexity:
O(n²)

#### Merge Sort
Uses divide-and-conquer approach.

Steps:
1. Split array recursively
2. Sort subarrays
3. Merge sorted arrays

Time Complexity:
O(n log n)

---

### Graph Theory Fundamentals
A graph is a structure made up of:

- Vertices (nodes)
- Edges (connections)

Types:
- Directed graph
- Undirected graph
- Weighted graph

Applications:
- Road maps
- Social networks
- Internet routing

Traversal methods:
- BFS (Breadth First Search)
- DFS (Depth First Search)

---

## Merge Sort Implementation

Implemented in Python and Node.JS.

### Algorithm
1. Divide array into halves
2. Recursively sort both halves
3. Merge sorted halves

---

## Benchmark Results

Generated 1000 random integers between 1 and 10000.

Measured runtime of Merge Sort.

Sample output:

```bash
Runtime: 0.0021 seconds
```

Benchmark screenshot saved in:

`/screenshots/benchmark-result.png`

---

## Runtime Observation
Merge Sort performed efficiently on 1000 integers.

Observations:
- Execution was very fast
- Runtime remained stable
- Performance scales better than O(n²) algorithms

---

## Complexity Analysis

### Time Complexity
- Best Case: O(n log n)
- Average Case: O(n log n)
- Worst Case: O(n log n)

### Space Complexity
- O(n)

Reason:
Additional memory is needed during merging.

---

## Repository Contents
- Merge Sort implementation
- Benchmark script
- Screenshot evidence
- Documentation notes