using AnketAPIs.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace AnketAPIs.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EvaluationController : ControllerBase
    {

        private readonly IConfiguration _configuration;

        public EvaluationController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("check/{studentId}/{teacherId}")]
        public IActionResult CheckTeacherEvaluation(int studentId, int teacherId)
        {
            // Veritabanı bağlantı dizesi
            string connectionString = _configuration.GetConnectionString("DefaultConnection");

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    // Sorgu
                    string query = "SELECT distinct 1 FROM Answers WHERE studentId = @studentId AND teacherId = @teacherId";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        // Parametre ekleme
                        command.Parameters.AddWithValue("@studentId", studentId);
                        command.Parameters.AddWithValue("@teacherId", teacherId);

                        // Sorguyu çalıştır
                        var result = command.ExecuteScalar();

                        // Sonuç değerlendirme
                        if (result != null)
                        {
                            return Ok(true); // Değerlendirilmiş
                        }
                        else
                        {
                            return Ok(false); // Değerlendirilmemiş
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Hata durumunda 500 döndür
                return StatusCode(500, new { Message = "Internal server error", Error = ex.Message });
            }
        }

    }
}
