/**
 * 根据用户ID生成头像URL
 * @param userId 用户ID
 * @returns 头像图片URL
 */
export const getAvatarUrl = (userId: string): string => {
  // 这里使用一个示例URL，您可以根据实际情况进行修改
  return `https://example.com/avatars/${userId}.jpg`;
};

// 如果文件中已有其他工具函数，可以保留它们
// 例如：
// export const resizeImage = (url: string, width: number, height: number) => {
//   // 实现图片调整大小的逻辑
// };
