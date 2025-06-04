using AnketAPIs.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace AnketAPIs.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public ReportController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("Get/{teacherId}")]
        public IActionResult GetReport(int teacherId)
        {
            List<Report> reportList = new List<Report>();
            // Veritabanı bağlantı dizesi
            string connectionString = _configuration.GetConnectionString("DefaultConnection");

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    // Sorgu
                    string query = @"SELECT
                                    Teachers.name AS TeacherName,
                                    Options.[option] AS OptionName,
                                    COUNT(Answers.id) AS OptionCount
                                FROM 
                                    Answers
                                INNER JOIN 
                                    Options ON Answers.optionId = Options.id
                                INNER JOIN 
                                    Teachers ON Answers.teacherId = Teachers.id
                                WHERE 
                                    Teachers.id = @teacherId 
                                GROUP BY 
                                    Teachers.name, Options.[option]
                                ORDER BY 
                                    Options.[option] ;";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        
                        command.Parameters.AddWithValue("@teacherId", teacherId);

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                reportList.Add(new Report
                                {
                                    TeacherName = reader.GetString(0), // id
                                    OptionName = reader.GetString(1), // name
                                    OptionCount = reader.GetInt32(2)
                                });
                            }
                        }

                        return Ok(reportList);
                    }
                }
            }
            catch (Exception ex)
            {
                // Hata durumunda 500 döndür
                return StatusCode(500, new { Message = "Internal server error", Error = ex.Message });
            }
        }

        [HttpGet("GetAllQuestionsReport/{teacherId}")]
        public async Task<List<QuestionOptionStatistics>> GetTeacherQuestionStatistics(int teacherId)
        {
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            var statistics = new List<QuestionOptionStatistics>();

            // Veritabanı bağlantısını açın
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();

                string query = @"
            SELECT 
                q.id AS QuestionId,
                q.question AS Question,
                o.id AS OptionId,
                o.[option] AS OptionText,
                COUNT(a.id) AS SelectionCount
            FROM 
                Answers a
            JOIN 
                Questions q ON a.questionId = q.id
            JOIN 
                Options o ON a.optionId = o.id
            WHERE 
                a.teacherId = @TeacherId
            GROUP BY 
                q.id, q.question, o.id, o.[option]
            ORDER BY 
                q.id, o.id;
        ";

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    // TeacherId parametresini ekleyin
                    command.Parameters.AddWithValue("@TeacherId", teacherId);

                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            // Sınıfı doldur ve listeye ekle
                            statistics.Add(new QuestionOptionStatistics
                            {
                                QuestionId = reader.GetInt32(0),
                                QuestionText = reader.GetString(1),
                                OptionId = reader.GetInt32(2),
                                OptionText = reader.GetString(3),
                                SelectionCount = reader.GetInt32(4)
                            });
                        }
                    }
                }
            }

            return statistics;
        }



    }
}



