using MedicalRecordAPI.DTOs;

namespace MedicalRecordAPI.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto> SignupAsync(SignupDto signupDto);
        Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
        Task<UserDto> GetCurrentUserAsync(int userId);
        Task<UserDto> UpdateProfileAsync(int userId, UpdateProfileDto updateDto, IFormFile? profileImage);
        string GenerateJwtToken(int userId, string email);
    }
}