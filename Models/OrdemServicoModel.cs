using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CentralTask.Models
{
    public class OrdemServicoModel
    {
        public int Id { get; set; }
        public string NumOs { get; set; }
        public string DataEmissao { get; set; }
        public string DataRecepcao { get; set; }
        public string CodContrato { get; set; }
        public string CodCliente { get; set; }
        public string NomeCliente { get; set; }
        public int CodOperador { get; set; }
        public string NomeOperador { get; set; }
        public string CodStatus { get; set; }
        public int NumMedicao { get; set; }
    }
}
