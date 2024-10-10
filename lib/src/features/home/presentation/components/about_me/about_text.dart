import 'package:flutter/material.dart';
import 'package:portfolio/src/common_widgets/shader_text_effect.dart';
import 'package:portfolio/src/localization/l10n.dart';
import 'package:portfolio/src/utils/theme/color_app.dart';

class AboutText extends StatelessWidget {
  const AboutText({super.key});

  @override
  Widget build(BuildContext context) {
    final headlineLarge = Theme.of(context).textTheme.headlineLarge;

    return RichText(
      textAlign: TextAlign.center,
      text: TextSpan(
        style: headlineLarge,
        children: [
          TextSpan(text: context.l10n.aboutText),
          ShaderTextSpan(
            shaderTextEffect: ShaderTextEffect(
              text: context.l10n.aboutIt,
              gradient: AppColor.textBusinessGradient,
              style: headlineLarge?.copyWith(color: Colors.white),
            ),
          ),
        ],
      ),
    );
  }
}
