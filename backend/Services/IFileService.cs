using MedicalRecordAPI.DTOs;

namespace MedicalRecordAPI.Services
{
    public interface IFileService
    {
        Task<FileResponseDto> UploadFileAsync(int userId, FileUploadDto fileUploadDto);
        Task<List<FileResponseDto>> GetUserFilesAsync(int userId);
        Task DeleteFileAsync(int userId, int fileId);
        Task<string> GetFilePathAsync(int userId, int fileId);
    }
}