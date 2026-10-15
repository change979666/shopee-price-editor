document.addEventListener('DOMContentLoaded', function() {
  const applyBtn = document.getElementById('applyBtn');
  const resetBtn = document.getElementById('resetBtn');
  const debugBtn = document.getElementById('debugBtn');
  const amountInput = document.getElementById('amount');
  const resultBox = document.getElementById('result');
  const foundCountEl = document.getElementById('foundCount');
  const modifiedCountEl = document.getElementById('modifiedCount');

  // 调试功能
  debugBtn.addEventListener('click', async function() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: 'debugInputs'
      });

      if (response.success) {
        const priceInputs = response.inputs.filter(input => input.isPrice);
        showResult(`🔍 找到 ${response.total} 个输入框，其中 ${priceInputs.length} 个包含价格数据。请查看浏览器控制台获取详细信息。`, 'warning');
        foundCountEl.textContent = priceInputs.length;
      }
    } catch (error) {
      showResult('❌ 调试失败: ' + error.message, 'error');
    }
  });

  // 应用价格修改
  applyBtn.addEventListener('click', async function() {
    const operation = document.querySelector('input[name="operation"]:checked').value;
    const amount = parseFloat(amountInput.value);

    // 验证输入
    if (isNaN(amount) || amount < 0) {
      showResult('请输入有效的调整金额!', 'error');
      return;
    }

    // 禁用按钮，防止重复点击
    applyBtn.disabled = true;
    applyBtn.textContent = '处理中...';

    try {
      // 获取当前活动标签页
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      // 向内容脚本发送消息
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: 'modifyPrices',
        operation: operation,
        amount: amount
      });

      // 显示结果
      if (response.success) {
        foundCountEl.textContent = response.found;
        modifiedCountEl.textContent = response.modified;
        
        if (response.modified > 0) {
          showResult(`✅ 成功修改 ${response.modified} 个价格!`, 'success');
        } else {
          showResult('⚠️ 未找到可修改的价格输入框。请确保页面已加载完成。', 'warning');
        }
      } else {
        showResult('❌ ' + response.message, 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showResult('❌ 执行失败: ' + error.message, 'error');
    } finally {
      // 恢复按钮状态
      applyBtn.disabled = false;
      applyBtn.textContent = '批量修改价格';
    }
  });

  // 重置功能
  resetBtn.addEventListener('click', function() {
    amountInput.value = '10';
    document.querySelector('input[name="operation"][value="decrease"]').checked = true;
    resultBox.classList.remove('show', 'success', 'error', 'warning');
    resultBox.textContent = '';
    foundCountEl.textContent = '0';
    modifiedCountEl.textContent = '0';
  });

  // 显示结果信息
  function showResult(message, type) {
    resultBox.textContent = message;
    resultBox.className = 'result-box show ' + type;
  }

  // 回车键快捷操作
  amountInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      applyBtn.click();
    }
  });
});
