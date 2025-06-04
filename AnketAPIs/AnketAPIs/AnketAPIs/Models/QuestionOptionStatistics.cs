namespace AnketAPIs.Models
{
    public class QuestionOptionStatistics
    {
        public int QuestionId { get; set; }     // Soru ID
        public string QuestionText { get; set; } // Soru Metni
        public int OptionId { get; set; }       // Seçenek ID
        public string OptionText { get; set; }  // Seçenek Metni
        public int SelectionCount { get; set; } // Seçim Sayısı
    }
}
