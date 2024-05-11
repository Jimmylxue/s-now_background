export * from './encrypt';

export function downloadWithLink(dataUrl: string, fileName?: string) {
  let link = document.createElement('a');
  link.href = dataUrl;
  if (fileName) {
    link.download = fileName;
  }
  link.click();
  // @ts-ignore
  link = null;
}

/**
 * 下载blob文件到本地
 */
export function downloadWithBlob(blob: Blob, fileName: string) {
  if ('msSaveOrOpenBlob' in navigator) {
    // 兼容ie
    const ieFileName = fileName.replace('.xlsx', '.excel');

    (window.navigator as any).msSaveOrOpenBlob(blob, ieFileName);
    return;
  }
  console.log('ddd', blob);
  const url = URL.createObjectURL(blob);
  console.log('gggg', url);

  downloadWithLink(url, fileName);
  console.log('url', url);
  URL.revokeObjectURL(url);
}
