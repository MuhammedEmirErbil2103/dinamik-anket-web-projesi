using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace AnketAPIs.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SurveyController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public SurveyController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("submit")]
        public IActionResult SubmitSurvey([FromBody] SurveyRequest request)
        {
            // Bağlantı dizesi
            string connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    connection.Open();

                    foreach (var answer in request.Answers)
                    {
                        // Cevapları ekleme sorgusu
                        string query = @"
                            INSERT INTO Answers (studentId, teacherId, questionId, optionId)
                            VALUES (@StudentId, @TeacherId, @QuestionId, @AnswerId)";

                        using (SqlCommand command = new SqlCommand(query, connection))
                        {
                            command.Parameters.AddWithValue("@StudentId", request.StudentId);
                            command.Parameters.AddWithValue("@TeacherId", request.TeacherId);
                            command.Parameters.AddWithValue("@QuestionId", answer.QuestionId);
                            command.Parameters.AddWithValue("@AnswerId", answer.AnswerId);

                            command.ExecuteNonQuery();
                        }
                    }

                    return Ok(new { Message = "Değerlendirme başarıyla kaydedildi." });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { Message = "Sunucu hatası", Error = ex.Message });
                }
            }


        }
    }

    // İstek modeli
    public class SurveyRequest
    {
        public int StudentId { get; set; }
        public int TeacherId { get; set; }
        public List<AnswerRequest> Answers { get; set; }
    }

    public class AnswerRequest
    {
        public int QuestionId { get; set; }
        public int AnswerId { get; set; }
    }
}
