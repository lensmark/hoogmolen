/**
 * directoryTraversal — recursief bestanden extraheren uit een DataTransfer.
 *
 * Gebruikt de webkitGetAsEntry API om mappen te ondersteunen in drag-and-drop.
 * Filtert op afbeeldings-MIME types (JPG, PNG, WebP).
 */

const SUPPORTED_TYPES = /^image\/(jpe?g|png|webp)$/i;
const SUPPORTED_EXT = /\.(jpe?g|png|webp)$/i;

interface FileSystemEntryLike {
  isFile: boolean;
  isDirectory: boolean;
  name: string;
  file?: (cb: (file: File) => void, err?: (e: unknown) => void) => void;
  createReader?: () => {
    readEntries: (
      cb: (entries: FileSystemEntryLike[]) => void,
      err?: (e: unknown) => void,
    ) => void;
  };
}

/** Lees alle entries in een directory (readEntries geeft batches van max 100). */
const readAllEntries = (
  reader: NonNullable<ReturnType<NonNullable<FileSystemEntryLike["createReader"]>>>,
): Promise<FileSystemEntryLike[]> =>
  new Promise((resolve, reject) => {
    const all: FileSystemEntryLike[] = [];
    const readBatch = () => {
      reader.readEntries((batch) => {
        if (batch.length === 0) {
          resolve(all);
        } else {
          all.push(...batch);
          readBatch();
        }
      }, reject);
    };
    readBatch();
  });

/** Recursief alle bestanden uit een entry verzamelen. */
const traverseEntry = async (entry: FileSystemEntryLike): Promise<File[]> => {
  if (entry.isFile && entry.file) {
    return new Promise((resolve) => {
      entry.file!(
        (file) => {
          if (SUPPORTED_TYPES.test(file.type) || SUPPORTED_EXT.test(file.name)) {
            resolve([file]);
          } else {
            resolve([]);
          }
        },
        () => resolve([]),
      );
    });
  }
  if (entry.isDirectory && entry.createReader) {
    const reader = entry.createReader();
    const entries = await readAllEntries(reader);
    const nested = await Promise.all(entries.map(traverseEntry));
    return nested.flat();
  }
  return [];
};

/**
 * Resultaat van een drop-extractie, met breakdown losse files vs. mappen.
 */
export interface DropExtraction {
  files: File[];
  looseFileCount: number;
  directoryCount: number;
  filesFromDirectories: number;
}

/**
 * Extract bestanden uit een DataTransferItemList (drop event).
 * Ondersteunt zowel losse bestanden als mappen (recursief).
 * Retourneert ook een breakdown voor UI-feedback.
 */
export const extractFilesFromDataTransfer = async (
  items: DataTransferItemList,
): Promise<DropExtraction> => {
  const loosePromises: Promise<File[]>[] = [];
  const dirPromises: Promise<File[]>[] = [];
  let directoryCount = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i] as DataTransferItem & {
      webkitGetAsEntry?: () => FileSystemEntryLike | null;
    };
    const entry: FileSystemEntryLike | null = item.webkitGetAsEntry?.() ?? null;
    if (entry?.isDirectory) {
      directoryCount += 1;
      dirPromises.push(traverseEntry(entry));
    } else if (entry?.isFile) {
      loosePromises.push(traverseEntry(entry));
    } else if (item.kind === "file") {
      const file = item.getAsFile();
      if (file && (SUPPORTED_TYPES.test(file.type) || SUPPORTED_EXT.test(file.name))) {
        loosePromises.push(Promise.resolve([file]));
      }
    }
  }

  const [looseResults, dirResults] = await Promise.all([
    Promise.all(loosePromises),
    Promise.all(dirPromises),
  ]);
  const looseFiles = looseResults.flat();
  const dirFiles = dirResults.flat();

  return {
    files: [...looseFiles, ...dirFiles],
    looseFileCount: looseFiles.length,
    directoryCount,
    filesFromDirectories: dirFiles.length,
  };
};

/** Filter een FileList (van <input type=file webkitdirectory>) op afbeeldingen. */
export const filterImageFiles = (files: FileList | File[]): File[] =>
  Array.from(files).filter(
    (f) => SUPPORTED_TYPES.test(f.type) || SUPPORTED_EXT.test(f.name),
  );
