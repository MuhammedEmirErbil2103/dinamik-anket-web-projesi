using AnketAPIs.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace AnketAPIs.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeacherController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public TeacherController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("all/{department}")]
        public IActionResult GetAllComputerTeachers(string department)
        {
            // Veritabanı bağlantı dizesi
            string connectionString = _configuration.GetConnectionString("DefaultConnection");

            // Öğretmen listesi
            List<ComTeacher> teachers = new List<ComTeacher>();

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    connection.Open();



                    // Sorgu
                    string query = department == "Bilgisayar" ? "SELECT * FROM Teachers where department = 'Bilgisayar'" : "SELECT * FROM Teachers where department = 'Yazılım'";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                teachers.Add(new ComTeacher
                                {
                                    id = reader.GetInt32(0), // id
                                    name = reader.GetString(1), // name
                                    email = reader.GetString(2), // email
                                    phone = reader.IsDBNull(3) ? null : reader.GetString(3), // phone (nullable)
                                    fields = reader.GetString(4), // fields
                                    image = reader.GetString(5)
                                });
                            }
                        }
                    }
                }

                return Ok(teachers); // Tüm öğretmenleri döndür
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Internal server error", Error = ex.Message });
            }
        }
    }
}
