using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using MedicalRecordAPI.DTOs;
using MedicalRecordAPI.Services;

namespace MedicalRecordAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FilesController : ControllerBase
    {
        private readonly IFileService _fileService;

        public FilesController(IFileService fileService)
        {
            _fileService = fileService;
        }

        [HttpPost("upload")]
        public async Task<ActionResult<FileResponseDto>> UploadFile([FromForm] FileUploadDto fileUploadDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var result = await _fileService.UploadFileAsync(userId, fileUploadDto);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while uploading file" });
            }
        }

        [HttpGet]
        public async Task<ActionResult<List<FileResponseDto>>> GetFiles()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var files = await _fileService.GetUserFilesAsync(userId);
                return Ok(files);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching files" });
            }
        }

        [HttpDelete("{fileId}")]
        public async Task<ActionResult> DeleteFile(int fileId)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                await _fileService.DeleteFileAsync(userId, fileId);
                return Ok(new { message = "File deleted successfully" });
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting file" });
            }
        }

        [HttpGet("download/{fileId}")]
        public async Task<ActionResult> DownloadFile(int fileId)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var filePath = await _fileService.GetFilePathAsync(userId, fileId);
                
                var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
                var fileName = Path.GetFileName(filePath);
                var contentType = GetContentType(filePath);

                return File(fileBytes, contentType, fileName);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (FileNotFoundException ex)
            {
                return NotFound(new { message = "File not found" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while downloading file" });
            }
        }

        private string GetContentType(string filePath)
        {
            var extension = Path.GetExtension(filePath).ToLowerInvariant();
            return extension switch
            {
                ".pdf" => "application/pdf",
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                _ => "application/octet-stream"
            };
        }
    }
}