using System.ComponentModel.DataAnnotations;

namespace MedicalRecordAPI.DTOs
{
    public class FileUploadDto
    {
        [Required]
        public string FileName { get; set; } = string.Empty;
        
        [Required]
        public string FileType { get; set; } = string.Empty;
        
        [Required]
        public IFormFile File { get; set; } = null!;
    }

    public class FileResponseDto
    {
        public int Id { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public DateTime UploadDate { get; set; }
    }
}