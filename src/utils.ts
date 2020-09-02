export function mergeObject<T>(obj1: T, obj2: T, obj3: T): T {
  const returnObj = {
    ...obj3,
    ...obj2,
    ...obj1,
  };

  for (let attr of Object.keys(returnObj)) {
    (returnObj as any)[attr] =
      (obj2 as any)[attr] !== (obj1 as any)[attr]
        ? (obj2 as any)[attr]
        : (obj3 as any)[attr] !== undefined
        ? (obj3 as any)[attr]
        : (obj1 as any)[attr];
  }

  return returnObj;
}

// tslint:disable-next-line: export-name
export function mergeArrays<T>(
  oldCollection: T[],
  updatedCollection: T[],
  remoteCollection: T[],
  uniqueIdentifier: (item: T) => string | number
): T[] {
  const oldIds = oldCollection.map((i) => uniqueIdentifier(i));
  const updatedIds = updatedCollection.map((i) => uniqueIdentifier(i));
  const remoteIds = remoteCollection.map((i) => uniqueIdentifier(i));

  const remoteRemovals = oldIds.filter((i) => !remoteIds.includes(i));
  const localUpdates = updatedCollection
    .filter((i) => {
      const id = uniqueIdentifier(i);
      const oldItem = oldCollection.find((_i) => {
        const _id = uniqueIdentifier(i);
        return _id === id;
      });
      if (oldItem) {
        for (let attr of Object.keys(oldItem).concat(Object.keys(i))) {
          if ((i as any)[attr] !== (oldItem as any)[attr]) {
            return true;
          }
        }
      }
      return false;
    })
    .map((i) => uniqueIdentifier(i));

  const resultCollection = updatedCollection
    .filter(
      (i) =>
        localUpdates.includes(uniqueIdentifier(i)) ||
        !remoteRemovals.includes(uniqueIdentifier(i)) ||
        !(
          localUpdates.includes(uniqueIdentifier(i)) &&
          remoteRemovals.includes(uniqueIdentifier(i))
        )
    )
    .map((i) => {
      const id = uniqueIdentifier(i);
      const oldItem =
        oldCollection.find((_i) => {
          const _id = uniqueIdentifier(i);
          return _id === id;
        }) || {};

      const remoteItem =
        remoteCollection.find((_i) => {
          const _id = uniqueIdentifier(i);
          return _id === id;
        }) || {};

      return mergeObject(oldItem, i, remoteItem) as T;
    });
  resultCollection.push(
    ...remoteCollection.filter((i) => {
      const id = uniqueIdentifier(i);

      return (
        !(oldIds.includes(id) && !updatedIds.includes(id)) &&
        !updatedIds.includes(id)
      );
    })
  );
  return resultCollection;
}
