import 'package:flutter/material.dart';
import 'package:portfolio/src/core/common_widgets/shader_text_effect.dart';
import 'package:portfolio/src/core/utils/theme/color_app.dart';
import 'package:portfolio/src/core/utils/theme/theme_extension.dart';
import 'package:portfolio/src/localization/l10n.dart';

class AboutText extends StatelessWidget {
  const AboutText({super.key});

  @override
  Widget build(BuildContext context) {
    return RichText(
      textAlign: TextAlign.center,
      text: TextSpan(
        style: context.headlineLarge,
        children: [
          TextSpan(text: context.l10n.aboutText),
          ShaderTextSpan(
            shaderTextEffect: ShaderTextEffect(
              text: context.l10n.aboutIt,
              gradient: AppColor.textBusinessGradient,
              style: context.headlineLarge?.copyWith(color: Colors.white),
            ),
          ),
        ],
      ),
    );
  }
}
