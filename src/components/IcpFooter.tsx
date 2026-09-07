/** ICP 备案号悬挂（管局要求：须展示于网站底部并链接至工信部备案官网） */
export default function IcpFooter() {
  return (
    <footer className="py-4 text-center text-xs text-gray-500">
      <a
        href="https://beian.miit.gov.cn/"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-gray-700"
      >
        粤ICP备2026129596号
      </a>
    </footer>
  )
}
