import random
import time
from MergeSort import merge_sort

numbers = [random.randint(1, 10000) for _ in range(1000)]

start = time.time()
sorted_numbers = merge_sort(numbers)
end = time.time()

print(f"Runtime: {end - start:.6f} seconds")