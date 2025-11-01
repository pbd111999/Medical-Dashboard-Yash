using System.ComponentModel.DataAnnotations;

namespace MedicalRecordAPI.Models
{
    public class MedicalFile
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(200)]
        public string FileName { get; set; } = string.Empty;
        
        [Required]
        [StringLength(50)]
        public string FileType { get; set; } = string.Empty;
        
        [Required]
        public string FilePath { get; set; } = string.Empty;
        
        public long FileSize { get; set; }
        
        public DateTime UploadDate { get; set; } = DateTime.UtcNow;
        
        // Foreign key
        public int UserId { get; set; }
        
        // Navigation property
        public virtual User User { get; set; } = null!;
    }
}