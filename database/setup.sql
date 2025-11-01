-- Medical Record Database Setup Script
-- Run this script to create the database and tables

-- Create database
CREATE DATABASE IF NOT EXISTS MedicalRecordDB;
USE MedicalRecordDB;

-- Create Users table
CREATE TABLE IF NOT EXISTS Users (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    FullName VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Gender VARCHAR(10) NOT NULL,
    PhoneNumber VARCHAR(20) NOT NULL,
    PasswordHash TEXT NOT NULL,
    ProfileImagePath VARCHAR(500) NULL,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (Email)
);

-- Create MedicalFiles table
CREATE TABLE IF NOT EXISTS MedicalFiles (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    FileName VARCHAR(200) NOT NULL,
    FileType VARCHAR(50) NOT NULL,
    FilePath TEXT NOT NULL,
    FileSize BIGINT NOT NULL,
    UploadDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UserId INT NOT NULL,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    INDEX idx_user_id (UserId),
    INDEX idx_upload_date (UploadDate)
);

-- Create uploads directory structure (this would be done by the application)
-- /uploads/profiles/ - for user profile images
-- /uploads/medical-files/{userId}/ - for medical files

SHOW TABLES;