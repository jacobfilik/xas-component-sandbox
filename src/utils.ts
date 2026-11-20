import ndarray, { type NdArray } from "ndarray";

export function reshapeSnake(
  data: number[],
  rowSize: number,
): NdArray<Float32Array> {
  let atest = data.slice();

  let num_rows = Math.floor(atest.length / rowSize);

  const partial = atest.length % rowSize;

  console.log(`data length: ${data.length} ${rowSize} ${partial}`);

  if (partial != 0) {
    const npad = rowSize - partial;
    const padding = Array.from({ length: npad }, () => NaN);
    num_rows = num_rows + 1;
    atest = atest.concat(padding);
  }

  console.log(`data length: ${atest.length} ${rowSize} ${partial}`);
  // const output = new Float32Array(num_rows*rowSize)

  const startTime = performance.now();

  for (let i = 0; i < num_rows; i = i + 1) {
    const start = i * rowSize;
    const stop = (i + 1) * rowSize;

    const r = atest.slice(start, stop);

    if (i % 2 == 1) {
      r.reverse();
    }

    atest.splice(start, r.length, ...r);
  }

  const output = new Float32Array(atest);

  const endTime = performance.now();

  console.log(`Call to reshape took ${endTime - startTime} milliseconds`);
  const new_y = ndarray(output, [num_rows, rowSize]);
  return new_y;
}
