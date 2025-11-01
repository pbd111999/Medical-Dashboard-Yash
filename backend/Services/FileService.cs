using Microsoft.EntityFrameworkCore;
using MedicalRecordAPI.Data;
using MedicalRecordAPI.DTOs;
using MedicalRecordAPI.Models;

namespace MedicalRecordAPI.Services
{
    public class FileService : IFileService
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public FileService(ApplicationDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        public async Task<FileResponseDto> UploadFileAsync(int userId, FileUploadDto fileUploadDto)
        {
            // Validate file
            if (fileUploadDto.File == null || fileUploadDto.File.Length == 0)
            {
                throw new ArgumentException("No file provided");
            }

            // Validate file type
            var allowedExtensions = new[] { ".pdf", ".jpg", ".jpeg", ".png" };
            var fileExtension = Path.GetExtension(fileUploadDto.File.FileName).ToLowerInvariant();
            
            if (!allowedExtensions.Contains(fileExtension))
            {
                throw new ArgumentException("Only PDF and image files are allowed");
            }

            // Validate file size (10MB max)
            if (fileUploadDto.File.Length > 10 * 1024 * 1024)
            {
                throw new ArgumentException("File size must be less than 10MB");
            }

            // Create uploads directory
            var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads", "medical-files", userId.ToString());
            Directory.CreateDirectory(uploadsFolder);

            // Generate unique filename
            var fileName = $"{Guid.NewGuid()}{fileExtension}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            // Save file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await fileUploadDto.File.CopyToAsync(stream);
            }

            // Save to database
            var medicalFile = new MedicalFile
            {
                FileName = fileUploadDto.FileName,
                FileType = fileUploadDto.FileType,
                FilePath = $"/uploads/medical-files/{userId}/{fileName}",
                FileSize = fileUploadDto.File.Length,
                UserId = userId,
                UploadDate = DateTime.UtcNow
            };

            _context.MedicalFiles.Add(medicalFile);
            await _context.SaveChangesAsync();

            return MapToFileResponseDto(medicalFile);
        }

        public async Task<List<FileResponseDto>> GetUserFilesAsync(int userId)
        {
            var files = await _context.MedicalFiles
                .Where(f => f.UserId == userId)
                .OrderByDescending(f => f.UploadDate)
                .ToListAsync();

            return files.Select(MapToFileResponseDto).ToList();
        }

        public async Task DeleteFileAsync(int userId, int fileId)
        {
            var file = await _context.MedicalFiles
                .FirstOrDefaultAsync(f => f.Id == fileId && f.UserId == userId);

            if (file == null)
            {
                throw new InvalidOperationException("File not found");
            }

            // Delete physical file
            var physicalPath = Path.Combine(_environment.WebRootPath, file.FilePath.TrimStart('/'));
            if (File.Exists(physicalPath))
            {
                File.Delete(physicalPath);
            }

            // Delete from database
            _context.MedicalFiles.Remove(file);
            await _context.SaveChangesAsync();
        }

        public async Task<string> GetFilePathAsync(int userId, int fileId)
        {
            var file = await _context.MedicalFiles
                .FirstOrDefaultAsync(f => f.Id == fileId && f.UserId == userId);

            if (file == null)
            {
                throw new InvalidOperationException("File not found");
            }

            var physicalPath = Path.Combine(_environment.WebRootPath, file.FilePath.TrimStart('/'));
            
            if (!File.Exists(physicalPath))
            {
                throw new FileNotFoundException("Physical file not found");
            }

            return physicalPath;
        }

        private FileResponseDto MapToFileResponseDto(MedicalFile file)
        {
            return new FileResponseDto
            {
                Id = file.Id,
                FileName = file.FileName,
                FileType = file.FileType,
                FilePath = file.FilePath,
                FileSize = file.FileSize,
                UploadDate = file.UploadDate
            };
        }
    }
}