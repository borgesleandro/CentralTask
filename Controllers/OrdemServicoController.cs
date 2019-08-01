using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CentralTask.Controllers
{
    public class OrdemServicoController : Controller
    {
        // GET: OrdemServico
        public ActionResult Index()
        {
            return View();
        }

        // GET: OrdemServico/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: OrdemServico/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: OrdemServico/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(IFormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here

                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: OrdemServico/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: OrdemServico/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, IFormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: OrdemServico/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: OrdemServico/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id, IFormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }
    }
}