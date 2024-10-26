import 'package:flutter/material.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/core/constants/business_information.dart';
import 'package:portfolio/src/core/utils/theme/color_app.dart';
import 'package:portfolio/src/localization/l10n.dart';

class InitialBanner extends StatelessWidget {
  const InitialBanner({super.key});

  @override
  Widget build(BuildContext context) {
    final wellcomeTo = context.l10n.initialBannerTitle;
    return SliverToBoxAdapter(
      child: SizedBox(
        height: Sizes.p48,
        width: double.infinity,
        child: DecoratedBox(
          decoration: const BoxDecoration(
            gradient: AppColor.textBusinessGradient,
          ),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 30),
            child: Align(
              child: FittedBox(
                child: Text(
                  '$wellcomeTo ${BusinessInformation.websiteType}',
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
